import { Typography } from 'antd';
import { memo } from 'react';

const { Title } = Typography;

const ModalContentEssayQuiz = ({scoreCurrent}) => {
  const { quiz, essayAnswer, filename } = scoreCurrent;

  return (
    <div className="overflow-hidden max-h-60">
          <Title level={3}>{quiz?.name}</Title>
          <div dangerouslySetInnerHTML={{ __html: essayAnswer }} />
          <div>
            <h3 className="text-lg font-bold mb-2">File đã nộp:</h3>
            <a
              href={filename}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Download File
            </a>
          </div>
        </div>
  )
}

export default memo(ModalContentEssayQuiz);