import {Button, Col, List, Row, Select, Typography} from 'antd';
import {memo, useEffect, useState} from 'react';
import ModalDetailQuiz from './modalDetailQuiz';
import moment from 'moment';

const ListItem = ({scoreHasUsersTestedItem}) => {
  const [selectTestNumData, setSelectTestNumData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoreCurrentInfo, setScoreCurrentInfo] = useState(null);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (scoreHasUsersTestedItem && scoreHasUsersTestedItem.scores?.length) {
      const scores = scoreHasUsersTestedItem.scores;

      const selectTestNumDataInit = scores.map((score, index) => ({
        label: `lần ${index + 1}`,
        value: score._id,
      }));

      setSelectTestNumData(selectTestNumDataInit);
      const scoreLast = JSON.parse(JSON.stringify(scores[scores.length - 1])) ;

      scoreLast.quiz = scoreHasUsersTestedItem.quiz;
      setScoreCurrentInfo(scoreLast);
    }
  }, [scoreHasUsersTestedItem]);

  const handleChange = (value) => {
    const scoreInfo = scoreHasUsersTestedItem.scores.find(
      (item) => item._id === value
    );

    scoreInfo.quiz = scoreHasUsersTestedItem.quiz
    setScoreCurrentInfo(scoreInfo);
  };

  return (
    <List.Item>
      <Row style={{width: '100%'}}>
        <Col span={6}>
          <Typography>
            {scoreHasUsersTestedItem && scoreHasUsersTestedItem.quiz.name}
          </Typography>
        </Col>
        <Col span={4}>
          <Typography>
            {scoreHasUsersTestedItem?.user?.firstName}{' '}
            {scoreHasUsersTestedItem?.user?.lastName}
          </Typography>
        </Col>
        <Col span={8}>
          <Select
            showSearch
            style={{
              width: 140,
            }}
            loading={!!!scoreHasUsersTestedItem}
            value={scoreCurrentInfo?._id}
            onChange={handleChange}
            placeholder='Search to Select'
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={selectTestNumData}
          />
          <Button
            className='ml-3'
            style={{width: '130px'}}
            onClick={() => setIsModalOpen(true)}
          >
            Xem chi tiết
          </Button>
        </Col>
        <Col span={2}>
          {scoreCurrentInfo?.scoreCustom || scoreCurrentInfo?.score || 0}
        </Col>
        <Col span={4}>
          {moment(scoreCurrentInfo?.submitTime).format('DD/MM/YYYY HH:mm:ss')}
        </Col>
      </Row>
      {isModalOpen && scoreCurrentInfo && (
        <ModalDetailQuiz
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          scoreCurrentInfo={scoreCurrentInfo}
        />
      )}
    </List.Item>
  );
};

export default memo(ListItem);
