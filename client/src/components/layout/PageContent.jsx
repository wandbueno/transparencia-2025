// components/Layout.js
import React from 'react';
import PageHeader from '../common/PageHeader';
import FilterSection from '../common/FilterSection';
import InfoText from '../common/InfoText';

const PageContent = ({ title, breadcrumb, children, infoTextHref }) => {
  return (
    <>
      <PageHeader title={title} breadcrumb={breadcrumb} />
      <FilterSection />
      <InfoText href={infoTextHref}>
        <p>Veja Declarações Negativas e Demais Documentos Clicando Aqui</p>
      </InfoText>
      {children}
    </>
  );
};

export default PageContent;
