import {UploadOutlined} from '@ant-design/icons';
import {Button, Col, Image, Row, Upload} from 'antd';
import { IMAGE_DEFAULT } from '../../../../constants';

const ImageBlock = ({data, file, logoOrg, handleBannerUpload, handleOrganizerUpload}) => {
  return (
    <Row>
      <Col span={12}>
        <label htmlFor='banner-img' className='text-lg font-medium mt-3 mr-3'>
          Banner contest image:
        </label>
        <Upload {...handleBannerUpload}>
          <Button className='mt-3' icon={<UploadOutlined />}>
            Choose banner
          </Button>
        </Upload>
        {data?.banner_url && !file && (
          <Image
            alt='Hình ảnh khóa học'
            className='edit-course-preview'
            fallback={IMAGE_DEFAULT}
            src={data.banner_url}
            style={{
              width: '20%',
              height: '20%',
              objectFit: 'contain',
            }}
          />
        )}
      </Col>
      <Col span={12}>
        <label htmlFor='course' className='text-lg font-medium mt-3 mr-3'>
          Organizer logo:
        </label>
        <Upload {...handleOrganizerUpload}>
          <Button className='mt-3' icon={<UploadOutlined />}>
            Choose logo
          </Button>
        </Upload>
        {data?.image_url && !logoOrg && (
          <Image
            alt='Hình logo ảnh khóa học'
            className='edit-course-preview'
            fallback={IMAGE_DEFAULT}
            src={data.image_url}
            style={{
              width: '20%',
              height: '20%',
              objectFit: 'contain',
            }}
          />
        )}
      </Col>
    </Row>
  );
};

export default ImageBlock;
