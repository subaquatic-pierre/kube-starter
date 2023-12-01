import { Box, Stack } from '@mui/material';
import useConfig from 'hooks/useConfig';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { I18n } from 'types/config';
import { ThemeDirection } from 'types/config';
import { basePath } from 'utils/const';

interface Props {
  handleSidebarClose?: () => void;
  fixed?: boolean;
}

const LanguageSelect: React.FC<Props> = ({
  handleSidebarClose,
  fixed = false,
}) => {
  const { onChangeLang } = useConfig();
  // const [lang, setLanguage] = useState<I18n>('en');

  const handleLangChange = (newLang: I18n) => {
    // setLanguage(newLang);
    if (newLang === 'ar') {
      onChangeLang('ar', ThemeDirection.RTL);
    } else {
      onChangeLang('en', ThemeDirection.LTR);
    }
  };

  // useEffect(() => {
  //   if (lang === 'ar') {
  //     onChangeLang('ar', ThemeDirection.RTL);
  //   } else {
  //     onChangeLang('en', ThemeDirection.LTR);
  //   }
  // }, [lang]);

  return (
    <Box sx={{ ...(fixed && { position: 'fixed', top: 20, right: 20 }) }}>
      <Stack
        direction="row"
        spacing={1}
        mr={2}
        sx={{ '& * img': { '&:hover': { cursor: 'pointer' } } }}
      >
        <Box onClick={() => handleLangChange('ar')}>
          <Image
            loading="eager"
            quality={100}
            width={35}
            height={21}
            src={`${basePath}/assets/svg/ae.svg`}
            alt={'flag'}
          />
        </Box>
        <Box onClick={() => handleLangChange('en')}>
          <Image
            loading="eager"
            quality={100}
            width={35}
            height={21}
            src={`${basePath}/assets/svg/gb.svg`}
            alt={'flag'}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default LanguageSelect;
