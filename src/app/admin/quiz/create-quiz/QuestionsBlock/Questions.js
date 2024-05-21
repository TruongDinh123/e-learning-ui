'use client';
import {Button, Card, Form, Select, Upload, Pagination} from 'antd';
import {useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import Editor from '@/config/quillConfig';
import ChooseBlock from './ChooseBlock';

const htmlToJson = (html) => {
  return JSON.stringify(html);
};

const Questions = ({
  form,
  setQuestionImages,
  questionImages,
  selectedQuizTemplate,
  isTemplateMode,
  handleSaveQuiz,
  setDeletedQuestionIds,
  deletedQuestionIds,
}) => {
  const [quizTemplates, setQuizTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const paginate = (page) => {
    setCurrentPage(page);
  };

  const getPropsQuestion = (key) => ({
    onRemove: () => {
      setQuestionImages((prevImages) => {
        const newQuestionImages = [...prevImages];
        newQuestionImages[key] = {file: null, deleteQuestionImage: true};
        return newQuestionImages;
      });
    },
    beforeUpload: (file) => {
      const newQuestionImages = [...questionImages];
      newQuestionImages[key] = {file: file, uploaded: false};

      setQuestionImages(newQuestionImages);
      return false;
    },
    fileList: questionImages[key]
      ? [
          {
            uid: questionImages[key].file
              ? questionImages[key].file.uid
              : questionImages[key].uid,
            name: questionImages[key].file
              ? questionImages[key].file.name
              : questionImages[key].name,
            status: 'done',
            url: questionImages[key].file
              ? questionImages[key].file.url
              : questionImages[key].url,
          },
        ]
      : [],
    accept: '.jpg, .jpeg, .png',
  });

  const handleImageUpload = (file, key) => {
    if (file.status !== 'removed') {
      setQuestionImages((prevState) => {
        const newState = [...prevState];
        newState[key] = {file: file, uploaded: false};
        return newState;
      });
    }
  };

  // Hàm xử lý khi thêm câu hỏi
  const handleAddQuestion = () => {
    const questions = form.getFieldValue('questions') || [];
    // Kiểm tra xem câu hỏi mới có trùng với câu hỏi mẫu không
    // Thêm câu hỏi mới vào danh sách
    const newQuestion = {isNew: true}; // Đánh dấu câu hỏi mới
    const newQuestions = [...questions, newQuestion];

    // Cập nhật danh sách câu hỏi với câu hỏi mới
    form.setFieldsValue({questions: newQuestions});

    // Kiểm tra số lượng câu hỏi sau khi thêm
    if (newQuestions.length % questionsPerPage === 0) {
      // Nếu số lượng câu hỏi đạt giới hạn của trang, chuyển đến trang tiếp theo
      const newCurrentPage = Math.ceil(newQuestions.length / questionsPerPage);
      setCurrentPage(newCurrentPage);
    }

    if (selectedQuizTemplate) {
      const selectedTemplate = quizTemplates.find(
        (template) => template._id === selectedQuizTemplate
      );
      if (selectedTemplate && selectedTemplate?.questions?.length > 0) {
        // Nếu có bài tập mẫu, chỉ thêm câu hỏi mới nếu nó không trùng lặp
        const templateQuestions = selectedTemplate.questions.map(
          (q) => q.question
        );
        if (!templateQuestions.includes('')) {
          form.setFieldsValue({questions: [...questions, {}]});
        }
      } else {
        // Nếu không có bài tập mẫu, thêm câu hỏi mới
        form.setFieldsValue({questions: [...questions, {}]});
      }
    } else {
      // Nếu không có bài tập mẫu, thêm câu hỏi mới
      form.setFieldsValue({questions: [...questions, {}]});
    }
  };

  // Hàm xử lý khi xóa câu hỏi
  const handleRemoveQuestion = (index) => {
    const questions = form.getFieldValue('questions') || [];
    const questionToRemove = questions[index];

    // Nếu câu hỏi có _id, thêm vào mảng deletedQuestionIds
    if (questionToRemove._id) {
      setDeletedQuestionIds([...deletedQuestionIds, questionToRemove._id]);
    }

    setQuestionImages((prevImages) => {
      const newQuestionImages = [...prevImages];
      newQuestionImages.splice(index, 1); // Xóa hình ảnh tại vị trí câu hỏi bị xóa
      return newQuestionImages;
    });

    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    form.setFieldsValue({questions: newQuestions});

    const totalQuestionsAfterRemoval = newQuestions.length;
    const minimumQuestionsForCurrentPage = (currentPage - 1) * questionsPerPage;
    if (
      totalQuestionsAfterRemoval <= minimumQuestionsForCurrentPage &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <>
      <div>
        <Form.List name='questions'>
          {(fields) => {
            // Tính toán chỉ số của câu hỏi đầu và cuối trên trang hiện tại
            const indexOfLastQuestion = currentPage * questionsPerPage;
            const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
            // Lọc ra các câu hỏi để hiển thị trên trang hiện tại
            const currentQuestions = fields.slice(
              indexOfFirstQuestion,
              indexOfLastQuestion
            );
            return (
              <>
                {currentQuestions.map((field, index) => (
                  <div key={field.key} className='pb-4'>
                    <Card
                      key={field.key}
                      title={`Câu hỏi ${indexOfFirstQuestion + index + 1}`}
                      extra={
                        <Button
                          danger
                          onClick={() =>
                            handleRemoveQuestion(indexOfFirstQuestion + index)
                          }
                        >
                          Xóa
                        </Button>
                      }
                      className='bg-slate-300'
                    >
                      <Form.Item
                        label='Câu hỏi'
                        name={[field.name, 'question']}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập câu hỏi.',
                          },
                        ]}
                      >
                        <Editor
                          placeholder='Nhập câu hỏi tại đây'
                          value={form.getFieldValue([
                            'questions',
                            field.name,
                            'question',
                          ])}
                          onChange={(html) => {
                            const jsonValue = htmlToJson(html);
                            form.setFieldValue({
                              [field.name]: {
                                question: jsonValue,
                              },
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item label='Hình ảnh' name={[field.name, 'image']}>
                        <Upload
                          {...getPropsQuestion(field.key)}
                          onChange={(event) =>
                            handleImageUpload(event.file, field.key)
                          }
                        >
                          <Button
                            className='custom-button'
                            type='primary'
                            icon={<UploadOutlined />}
                          >
                            Thêm tệp
                          </Button>
                        </Upload>
                      </Form.Item>

                      <ChooseBlock
                        form={form}
                        field={field}
                      
                      />
                      <Form.Item
                        label='Đáp án'
                        name={[field.name, 'answer']}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập đáp án',
                          },
                        ]}
                      >
                        <Select placeholder='Chọn đáp án'>
                          {form
                            .getFieldValue(['questions', field.name, 'options'])
                            ?.map((option, optionIndex) => (
                              <Select.Option
                                key={optionIndex}
                                value={option?.option}
                              >
                                {option?.option}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Card>
                  </div>
                ))}
                <Button
                  type='dashed'
                  className='bg-orange-200'
                  onClick={() => handleAddQuestion()}
                  block
                >
                  + Thêm câu hỏi
                </Button>
                {fields.length > 0 && (
                  <Pagination
                    current={currentPage}
                    total={fields.length}
                    pageSize={questionsPerPage}
                    onChange={paginate}
                    className='pagination-bar pt-4'
                    responsive={true}
                  />
                )}
              </>
            );
          }}
        </Form.List>
      </div>

      <div className='pt-2 text-end'>
        {!isTemplateMode && (
          <>
            <Button
              className='custom-button'
              type='primary'
              style={{marginRight: 8}}
              onClick={() => {
                form.validateFields().then((values) => {
                  handleSaveQuiz(values, 'save_draft');
                });
              }}
            >
              Lưu Bản Nháp
            </Button>

            <Button
              type='primary'
              className='custom-button'
              onClick={() => {
                handleSaveQuiz(form.getFieldsValue(), 'assign');
              }}
            >
              Hoàn Thành
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Questions;
