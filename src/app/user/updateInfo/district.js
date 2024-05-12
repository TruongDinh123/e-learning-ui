import {useEffect, useState} from 'react';
import {options} from '../../signup/utils';

const District = ({
  selectedCap,
  selectedDonVi,
  donViCon,
  setSelectedCap,
  setSelectedDonVi,
  setDonViCon,
}) => {
  const [donViOptions, setDonViOptions] = useState([]);
  const [subUnits, setSubUnits] = useState([]);

  useEffect(() => {
    if (selectedCap === 'Cấp tỉnh') {
      setDonViOptions(options['Cấp tỉnh']);
    } else if (selectedCap === 'Cấp huyện') {
      setDonViOptions(Object.keys(options['Cấp huyện']));
    } else {
      setDonViOptions([]);
    }
    setSelectedDonVi('');
    setSubUnits([]);
  }, [selectedCap, setSelectedDonVi]);

  useEffect(() => {
    if (selectedCap === 'Cấp huyện') {
      setSubUnits(options['Cấp huyện'][selectedDonVi] || []);
    } else {
      setSubUnits([]);
    }
  }, [selectedDonVi, selectedCap]);

  return (
    <div className='space-y-2 mb-3'>
      <p className='text-sm font-medium'>Đơn vị công tác</p>
      <label className='text-base text-sm mt-1' htmlFor='cap'>
        <select
          value={selectedCap}
          onChange={(e) => setSelectedCap(e.target.value)}
        >
          <option value=''>Chọn Cấp</option>
          <option value='Cấp tỉnh'>Cấp tỉnh</option>cd
          <option value='Cấp huyện'>Cấp huyện</option>
          <option value='Cấp xã'>Cấp xã</option>
        </select>
      </label>{' '}
      <br />
      <label className='text-base text-sm mt-1' htmlFor='donvi'>
        {selectedCap && selectedCap !== 'Cấp xã' && (
          <select
            className='mt-2'
            value={selectedDonVi}
            onChange={(e) => setSelectedDonVi(e.target.value)}
            disabled={!selectedCap}
          >
            <option value=''>Chọn đơn vị</option>
            {donViOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit.replace(/^-+/, '')}
              </option>
            ))}
          </select>
        )}
      </label>
      <br />
      <label className='text-base text-sm mt-1' htmlFor='donvicon'>
        {selectedDonVi && subUnits.length !== 0 && (
          <select
            className='mt-2'
            value={donViCon}
            disabled={!selectedDonVi || subUnits.length === 0}
            onChange={(e) => setDonViCon(e.target.value)}
          >
            <option value=''>Chọn đơn vị con</option>
            {subUnits.map((subUnit) => (
              <option key={subUnit} value={subUnit}>
                {subUnit.replace(/^-+/, '')}
              </option>
            ))}
          </select>
        )}
      </label>
    </div>
  );
};

export default District;
