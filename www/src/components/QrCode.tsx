import { Box, Button, Stack, Typography } from '@mui/material';
import React, { createRef, useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import QRCode, { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { basePath } from 'utils/const';
import { UserProfile, UserRoleEnum } from 'models/auth';
import { sleep } from 'utils/sleep';
import useAuth from 'hooks/useAuth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const stringToElement = (svgString: string): HTMLElement => {
  var template = document.createElement('template');
  svgString = svgString.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = svgString;

  const el = template.content.firstChild as HTMLElement;

  return el;
};

const dataURLtoBlob = (dataURL: string): Blob => {
  let array, binary, i, len;
  binary = atob(dataURL.split(',')[1]);
  array = [];
  i = 0;
  len = binary.length;
  while (i < len) {
    array.push(binary.charCodeAt(i));
    i++;
  }
  return new Blob([new Uint8Array(array)], {
    type: 'image/png',
  });
};

interface Props {
  qrData: any;
  badgeName: any;
  ticketType: UserRoleEnum;
}

const QrCode: React.FC<Props> = ({ qrData, badgeName, ticketType }) => {
  const { profile, role } = useAuth();
  const downloadRef = useRef<HTMLAnchorElement>();

  const elImage = (
    <QRCodeCanvas
      value={`${qrData}`}
      size={400}
      bgColor={'#ffffff'}
      fgColor={'#000000'}
      level={'H'}
      includeMargin={true}
      imageSettings={{
        src: `${basePath}/fsc-logo-notext.png`,
        x: undefined,
        y: undefined,
        height: 100,
        width: 100,
        excavate: true,
      }}
    />
  );

  const handleLoad = async () => {
    await sleep(1);
    if (window) {
      const button = document.getElementById('button');
      const elStr = ReactDOMServer.renderToString(elImage);
      const htmlEl = stringToElement(elStr) as HTMLCanvasElement;
      const el = document.getElementById('canvas') as HTMLCanvasElement;
      // if (el) {
      //   downloadRef.current.href = el.toDataURL();
      // }
      // handleLoad();
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  const handleClick = () => {
    const elStr = ReactDOMServer.renderToString(elImage);
    const htmlEl = stringToElement(elStr) as HTMLCanvasElement;

    const file = dataURLtoBlob(htmlEl.toDataURL());
    const fd = new FormData();

    console.log(file);

    fd.append('image', file);

    console.log(fd);

    window.location.href = htmlEl.toDataURL();
  };

  const downloadPdf = () => {
    const element = document.getElementById('badge-print');

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 148], // Adjust the size as per your requirement
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 100, 148);
      pdf.save('download.pdf');
    });
  };

  return (
    <div>
      <Stack
        sx={{ maxWidth: '100%', position: 'relative', textAlign: 'center' }}
        id="badge-print"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '64%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            width: '100%',
          }}
        >
          <Typography variant="h2" sx={{ marginBottom: 0.5 }}>
            {badgeName}
          </Typography>
          <QRCodeCanvas
            id="canvas"
            value={`${qrData}`}
            size={150}
            bgColor={'#ffffff'}
            fgColor={'#000000'}
            level={'H'}
            includeMargin={true}
            imageSettings={{
              src: `${basePath}/fsc-logo-notext.png`,
              x: undefined,
              y: undefined,
              height: 30,
              width: 30,
              excavate: true,
            }}
          />
        </Box>

        <Box
          sx={{
            width: 500,
            height: 600, // Adjust the height as per your requirements
            backgroundImage: `url(${basePath}/images/${ticketType}_new.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Empty box to hold space for the background image. QR Code will overlay this due to absolute positioning */}
        </Box>
      </Stack>
      <Box mt={6} display="flex" justifyContent="flex-end">
        <Button
          component="a"
          id="button"
          variant="contained"
          onClick={downloadPdf}
        >
          Download PDF
        </Button>
      </Box>
    </div>
  );
};

export default QrCode;
