import { Autocomplete, TextField } from '@mui/material';
import { getProfiles } from 'lib/api';
import { GET_SPEAKERS } from 'lib/endpoints';
import { useEffect, useState } from 'react';

interface Props {
  setSpeakerId: (id: number | null) => void;
  speakerId: number | null;
}

const SpeakerSelectAutoComplete: React.FC<Props> = ({
  setSpeakerId,
  speakerId,
}) => {
  const [speakerOptions, setSpeakerOptions] = useState<
    {
      id: number;
      label: string;
    }[]
  >([]);

  const loadProfiles = async () => {
    const profiles = await getProfiles(GET_SPEAKERS);

    let options = [];

    for (const profile of profiles) {
      let label = '';
      if (profile.firstName) label += profile.firstName;
      if (profile.lastName) label += ' ' + profile.lastName;

      options.push({ id: profile.id, label: label ?? profile.email });
    }

    setSpeakerOptions(options);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const getInitialValue = (): { id: number; label: string } | undefined => {
    if (speakerId) {
      const val = speakerOptions.find((speaker) => speaker.id === speakerId);

      if (val) {
        return val;
      }
    }
    return null;
  };

  const getInitialInputValue = (): string => {
    if (speakerId) {
      const val = speakerOptions.find((speaker) => speaker.id === speakerId);

      if (val) {
        return val.label;
      }
    }
    return '';
  };

  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<{ id: number; label: string } | null>(
    null,
  );

  useEffect(() => {
    const initialInputValue = getInitialInputValue();
    const initialValue = getInitialValue();

    setInputValue(initialInputValue);
    setValue(initialValue);
  }, [speakerId, speakerOptions]);

  return (
    <Autocomplete
      // disablePortal
      id="cal-speaker"
      // freeSolo
      value={value}
      inputValue={inputValue}
      options={speakerOptions}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        setSpeakerId(newValue ? newValue.id : null);
        setValue(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          // {...getFieldProps('speakerId')}
          placeholder="Speaker"
        />
      )}
    />
  );
};

export default SpeakerSelectAutoComplete;
