import { BellIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, HStack, VStack, Icon, Stack, Text, useColorModeValue, Spinner, useInterval } from '@chakra-ui/react'
import * as React from 'react'
import Holidays from 'date-holidays'

const hd = new Holidays('DE', 'bw');
const bwHolidays = hd.getHolidays();

const isWorkingDay = (_date) => {
  const isSaturday = _date.getDay() === 6;
  const isSunday = _date.getDay() === 0;
  const isPublicHoliday = hd.isHoliday(_date);

  return !isSaturday && !isSunday && !isPublicHoliday;
}

const createDate = (d, m, yyyy) => {
  return new Date(yyyy, m - 1, d, 0, 0, 0, 1);
}

const today = () => new Date();

const dayMs = 3600 * 24 * 1000;
const monthMs = dayMs * 30; // ~ ca. days per month

const freedomDate = createDate(1,4,2022);

const dateStateGenerator = () => {
  const nowTime = today().getTime();
  const dateDiff = freedomDate.getTime() - nowTime;
  const remainingFullDays = Math.floor(dateDiff / dayMs);
  
  return {
    nowTime,
    dateDiff,
    remainingFullDays
  }
};


export const Home = () => {
  const [dates, setDateInfo] = React.useState(dateStateGenerator);

  const {nowTime, dateDiff, remainingFullDays} = dates;

  const updater = useInterval(() => {
    setDateInfo(dateStateGenerator);
  }, 1000);

  let countWorkingDays = 0;
  for (let i=0; i < remainingFullDays; i++) {
    const dayToCheckMs = nowTime + (i + 1) * dayMs;

    const _isWorkingDay = isWorkingDay(new Date(dayToCheckMs));
    if (_isWorkingDay) {
      countWorkingDays++;
    }
  }

  return (
  <Box as="section">
    <Stack
      direction={{ base: 'column', sm: 'row' }}
      justifyContent="center"
      alignItems="center"
      height={'100%'}
      padding={5}
      color="white"
      bg={useColorModeValue('blue.600', 'blue.400')}
    >
      <HStack spacing="3">
        
        <VStack spacing="3">
          <Text fontWeight="medium">
            <Icon as={TimeIcon} fontSize="2xl" h="10" margin={3} /> 
            Freedom @ {freedomDate.getDate()}.{freedomDate.getMonth() + 1}.{freedomDate.getUTCFullYear()}
          </Text>
          <Text fontWeight="medium" >
          <Icon as={BellIcon} fontSize="2xl" h="10" />
            Noch {remainingFullDays} Tage, davon {countWorkingDays} Arbeitstage
          </Text>

          
        </VStack>
        
      </HStack>
    </Stack>
    
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} padding={6}>
      Noch {Math.floor(dateDiff / 1000)} Sekunden
    </Box>
  </Box>)
}

export default Home