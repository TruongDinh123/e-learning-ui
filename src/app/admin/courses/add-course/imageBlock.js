import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Upload } from 'antd';

const ImageBlock = ({ handleBannerUpload, handleOrganizerUpload }) => {
  return (
    <Row>
      <Col span={12}>
        <label htmlFor="banner-img" className="text-lg font-medium mt-3 mr-3">
          Banner contest image:
        </label>
        <Upload {...handleBannerUpload}>
          <Button className="mt-3" icon={<UploadOutlined />}>
            Choose banner
          </Button>
        </Upload>
      </Col>
      <Col span={12}>
        <label htmlFor="course" className="text-lg font-medium mt-3 mr-3">
          Organizer logo:
        </label>
        <Upload {...handleOrganizerUpload}>
          <Button className="mt-3" icon={<UploadOutlined />}>
            Choose logo
          </Button>
        </Upload>
      </Col>
    </Row>
  )
}

export default ImageBlock;
