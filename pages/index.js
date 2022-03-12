import { QUIT_CONFIG } from "../quit.config";
import { BellIcon, TimeIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import {
  Box,
  HStack,
  VStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Spinner,
  useInterval,
  Progress,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Link,
} from "@chakra-ui/react";
import * as React from "react";
import Holidays from "date-holidays";

const createDate = (d, m, yyyy) => {
  return new Date(yyyy, m - 1, d, 0, 0, 0, 1);
};

const NOTICE_HANDED_IN_DATE_CONFIG = QUIT_CONFIG.start;
const IM_OUT_DATE_CONFIG = QUIT_CONFIG.end;
const HOLIDAYS_LOCATION_CONFIG = QUIT_CONFIG.holidays;
const TREAT_SATURDAY_AS_WORKDAY = QUIT_CONFIG.treatSaturdayAsWorkday;

const noticeDate = createDate(
  NOTICE_HANDED_IN_DATE_CONFIG.day,
  NOTICE_HANDED_IN_DATE_CONFIG.month,
  NOTICE_HANDED_IN_DATE_CONFIG.year
);

const freedomDate = createDate(
  IM_OUT_DATE_CONFIG.day,
  IM_OUT_DATE_CONFIG.month,
  IM_OUT_DATE_CONFIG.year
);
// -------------------

const hd = !HOLIDAYS_LOCATION_CONFIG?.disable
  ? new Holidays(
      HOLIDAYS_LOCATION_CONFIG.country,
      HOLIDAYS_LOCATION_CONFIG.state
    )
  : null;

function isDayHoliday(date) {
  return hd !== null && hd.isHoliday(date);
}

const isWorkingDay = (_date) => {
  const isSaturday = _date.getDay() === 6;
  const isSunday = _date.getDay() === 0;

  const _isHoliday = isDayHoliday(_date);

  return (
    (!isSaturday || !TREAT_SATURDAY_AS_WORKDAY) && !isSunday && !_isHoliday
  );
};

const today = () => new Date();
const dayMs = 3600 * 24 * 1000;

const dateStateGenerator = () => {
  const nowTime = today().getTime();
  const dateDiff = freedomDate.getTime() - nowTime;
  const totalDiff = freedomDate.getTime() - noticeDate.getTime();
  const alreadyEnduredDays = Math.floor(
    (nowTime - noticeDate.getTime()) / dayMs
  );
  let alreadyEnduredPercent =
    100 * (dateDiff < 0 ? 1 : (totalDiff - dateDiff) / totalDiff);

  const remainingFullDays = Math.max(0, Math.floor(dateDiff / dayMs));

  return {
    nowTime,
    dateDiff,
    remainingFullDays,
    alreadyEnduredPercent: alreadyEnduredPercent.toFixed(2),
    alreadyEnduredDays,
  };
};

export const Home = () => {
  const [dates, setDateInfo] = React.useState(dateStateGenerator);

  const {
    nowTime,
    dateDiff,
    remainingFullDays,
    alreadyEnduredPercent,
    alreadyEnduredDays,
  } = dates;

  const hasReachedEnd = dateDiff <= 0;

  useInterval(() => {
    setDateInfo(dateStateGenerator);
  }, 1000);

  let countWorkingDays = 0;
  for (let i = 0; i < remainingFullDays; i++) {
    const dayToCheckMs = nowTime + (i + 1) * dayMs;

    const _isWorkingDay = isWorkingDay(new Date(dayToCheckMs));
    if (_isWorkingDay) {
      countWorkingDays++;
    }
  }

  return (
    <Box padding={"7"}>
      <Box
        as="section"
        maxW={"5xl"}
        margin="auto"
        borderRadius={"lg"}
        overflow="hidden"
        border={"1px"}
        borderColor={"blue.400"}
      >
        <Stack
          direction={{ base: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          height={"100%"}
          padding={5}
          color="black"
          bg={hasReachedEnd ? "green.200" : "orange.200"}
        >
          <HStack spacing="3">
            <VStack spacing="3">
              <Text fontWeight="medium" fontSize="2xl">
                {!hasReachedEnd && (
                  <>
                    <Icon as={TimeIcon} h="10" margin={3} fontSize="3xl" />
                    Freedom @ <button />
                  </>
                )}
                {hasReachedEnd && "You are free since "}
                <strong>
                  {freedomDate.getDate()}.{freedomDate.getMonth() + 1}.
                  {freedomDate.getUTCFullYear()}
                </strong>
              </Text>
            </VStack>
          </HStack>
        </Stack>

        <Progress
          hasStripe
          value={alreadyEnduredPercent}
          colorScheme={hasReachedEnd ? "green" : "purple"}
        />

        <StatGroup margin={"5"}>
          <Stat>
            <StatLabel fontSize={"xl"}>Days to go</StatLabel>
            <StatNumber>{remainingFullDays}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel fontSize={"xl"}>Working days to go</StatLabel>
            <StatNumber>{countWorkingDays}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel fontSize={"xl"}>Days passed since notice</StatLabel>
            <StatNumber>{alreadyEnduredDays}</StatNumber>
          </Stat>
        </StatGroup>

        {!hasReachedEnd && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            padding={6}
          >
            {Math.max(0, Math.floor(dateDiff / 1000))} Seconds to go
          </Box>
        )}

        <Box textAlign={"center"}>
          {hasReachedEnd && (
            <img
              src="https://media.giphy.com/media/ZdFxoPhIS4glG/giphy.gif"
              style={{ display: "inline" }}
            />
          )}
        </Box>
      </Box>

      <Text
        fontWeight="medium"
        fontSize="4xl"
        textAlign={"center"}
        paddingTop="12"
      >
        <h2>Create your own:</h2>
        <Box marginTop={"4"}>
          <NextLink href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Factivenode%2Fquitme">
            <Button colorScheme={"pink"} size="lg">
              Deploy on Vercel
            </Button>
          </NextLink>
          &nbsp;
          <NextLink href="https://github.com/activenode/quitme">
            <Button colorScheme={"messenger"} size="lg">
              Fork me on GitHub
            </Button>
          </NextLink>
        </Box>
      </Text>
    </Box>
  );
};

export default Home;
