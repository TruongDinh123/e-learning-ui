import ListQuestion from '../list-question/page';
import ActionsRow from './actionsRow';

export const columns = [
  {
    title: 'SNo.',
    dataIndex: 'key',
  },
  {
    title: 'Tên đề thi',
    dataIndex: 'name',
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Loại hình thức',
    dataIndex: 'type',
    render: (text) =>
      text === 'multiple_choice'
        ? 'Trắc Nghiệm'
        : text === 'essay'
        ? 'Tự luận'
        : text,
    onFilter: (value, record) => record.type.indexOf(value) === 0,
    sorter: (a, b) => a.type.localeCompare(b.type),
    sortDirections: ['descend'],
  },
  {
    title: 'Chi tiết câu hỏi',
    dataIndex: 'questions',
    onFilter: (value, record) => record.questions.indexOf(value) === 0,
    sorter: (a, b) => a.questions.length - b.questions.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Chức năng',
    dataIndex: 'action',
  },
];

export const initData = ({quiz}) => {
  let data = [];
  const dataItem = ({index, quizItem}) => ({
    key: index + 1,
    name: quizItem?.name,
    type: quizItem?.type,
    questions: <ListQuestion quizId={quizItem._id} />,
    action: <ActionsRow quizItem={quizItem} />,
  });

  quiz.forEach((quizItem, index) => {
      console.log(quizItem, 'quizItemquizItem');
      data.push(
        dataItem({
          index,
          quizItem,
        })
      );
    
     
  });

  return data;
};
