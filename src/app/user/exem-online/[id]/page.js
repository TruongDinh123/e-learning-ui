'use client';

import ContentExemplOnline from '../content-exem-online/page';
import HeaderExemplOnline from '../header-exem-online/page';
import useInitUserScreen from '../../../../hooks/useInitUserScreen';

export default function ExempleOnline({params}) {
  useInitUserScreen({idCourse: params.id});

  return (
    <>
      <HeaderExemplOnline />
      <ContentExemplOnline />
    </>
  );
}
