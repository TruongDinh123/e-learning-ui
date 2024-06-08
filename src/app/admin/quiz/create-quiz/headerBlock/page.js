import {Col, Row} from 'antd';
import DraftChoose from './DraftChoose';
import CoursesSelect from './coursesSelect';

const HeaderBlock = ({
  form,
  setInitialQuestions,
  setQuestionImages,
  setSelectedQuizTemplate,
  setSelectedQuizId,
  selectedCourse,
  setSelectedCourse,
}) => {
  return (
    <Row gutter={16} className=''>
      <Col xs={24} sm={12} md={8} lg={6}>
        <CoursesSelect
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DraftChoose
          form={form}
          setInitialQuestions={setInitialQuestions}
          setQuestionImages={setQuestionImages}
          setSelectedQuizTemplate={setSelectedQuizTemplate}
          setSelectedQuizId={setSelectedQuizId}
        />
      </Col>
    </Row>
  );
};

export default HeaderBlock;
