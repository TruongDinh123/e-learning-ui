import {Button, Col, List, Row, Select, Typography} from 'antd';
import {memo, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import ModalDetailQuiz from './modalDetailQuiz';
import moment from 'moment';

const ListItem = ({userTested}) => {
  const scores = useSelector((state) => state.quiz.scoreByQuizIdInfo);
  const [selectTestNumData, setSelectTestNumData] = useState([]);
  const [scoreCurrent, setScoreCurrent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoreCurrentInfo, setScoreCurrentInfo] = useState(null);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (scores) {
      const scoresUser = scores
        .filter((score) => score.user._id === userTested._id)
        .sort((item1, item2) => item1.orderNum - item2.orderNum);
      const dataSelectInit = scoresUser.map((item) => ({
        label: `Lần ${item.orderNum}`,
        value: item._id,
      }));
      setSelectTestNumData(dataSelectInit);
      setScoreCurrent(dataSelectInit[0].value);
    }
  }, [scores, userTested._id]);

  useEffect(() => {
    if (scoreCurrent && scores) {
      const scoreInfo = scores.find((item) => item._id === scoreCurrent);
      setScoreCurrentInfo(scoreInfo);
    }
  }, [scoreCurrentInfo, scoreCurrent, scores]);

  console.log(
    userTested,
    'userTesteduserTested',
    selectTestNumData,
    scoreCurrent,
    scores,
    scoreCurrentInfo
  );
  return (
    <List.Item>
      <Row style={{width: '100%'}}>
        <Col span={6}>
          <Typography>
            {userTested.firstName} {userTested.lastName}
          </Typography>
        </Col>
        <Col span={8}>
          <Select
            showSearch
            style={{
              width: 140,
            }}
            loading={!!!scores}
            value={scoreCurrent}
            onChange={(value) => setScoreCurrent(value)}
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
        <Col span={2}>{scoreCurrentInfo?.score}</Col>
        <Col span={8}>{moment(scoreCurrentInfo?.submitTime).format("DD/MM/YYYY HH:mm:ss")}</Col>

        
      </Row>
      {isModalOpen && scoreCurrentInfo && (
        <ModalDetailQuiz
          isModalOpen={isModalOpen}
          scoreCurrent={scoreCurrent}
          handleCancel={handleCancel}
          scoreCurrentInfo={scoreCurrentInfo}
        />
      )}
    </List.Item>
  );
};

export default memo(ListItem);
