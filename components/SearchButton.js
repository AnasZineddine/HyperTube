import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  Stack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  useRadio,
  useRadioGroup,
  Center,
  Grid,
  Divider,
  Select,
  HStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Search2Icon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import fr from "../utils/fr";
import en from "../utils/en";

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "blue.300",
          color: "white",
          borderColor: "blue.300",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        <Center>{props.children}</Center>
      </Box>
    </Box>
  );
}

const SearchButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [yearGap, setYearGap] = React.useState("");
  const [ratingGap, setRatingGap] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [order, setOrder] = React.useState("");
  const { locale } = router;
  const t = locale === "en" ? en : fr;

  const handleChange = (event) => setValue(event.target.value);
  const handleChange2 = (event) => setSort(event.target.value);
  const handleChange3 = (event) => setOrder(event.target.value);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "genres",
    defaultValue: "All",
    onChange: setGenre,
  });

  const group = getRootProps();

  const options = [
    t.all,
    t.comedy,
    t.action,
    t.horror,
    t.scifi,
    t.romance,
    t.thriller,
    t.drama,
    t.adventure,
    t.animation,
    t.documentary,
    t.crime,
  ];
  return (
    <>
      <IconButton ref={btnRef} onClick={onOpen} icon={<Search2Icon />} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t.searchmovies}</DrawerHeader>
          <DrawerBody>
            <Stack spacing={2}>
              <Input
                value={value}
                placeholder="Type here..."
                onChange={handleChange}
              />
              <Button
                colorScheme="blue"
                onClick={() => {
                  value && router.push(`/?keyword=${value}`);
                  onClose();
                  setValue("");
                }}
              >
                {t.quicksearch}
              </Button>
              <Divider p={1} />
              <Stack pt={10} spacing={10}>
                <HStack>
                  <Select
                    variant="filled"
                    placeholder={t.sortby}
                    onChange={handleChange2}
                  >
                    <option value="name">{t.name}</option>
                    <option value="rating">{t.rating}</option>
                    <option value="released">{t.released}</option>
                    <option value="trending">{t.trending}</option>
                    <option value="updated">{t.updated}</option>
                    <option value="year">{t.year}</option>
                  </Select>
                  <Select
                    variant="filled"
                    placeholder={t.order}
                    onChange={handleChange3}
                  >
                    <option value="1">{t.ascending}</option>
                    <option value="-1">{t.descending}</option>
                  </Select>
                </HStack>
                <Grid {...group} templateColumns="repeat(2, 1fr)" gap={6}>
                  {options.map((value) => {
                    const radio = getRadioProps({ value });
                    return (
                      <RadioCard key={value} {...radio}>
                        {value}
                      </RadioCard>
                    );
                  })}
                </Grid>

                <Stack spacing={3}>
                  <Text>
                    {t.yeargap} {String(yearGap).match(/.{1,4}/g)}
                  </Text>
                  <RangeSlider
                    min={1900}
                    max={2022}
                    step={5}
                    defaultValue={[1900, 2022]}
                    onChangeEnd={(yearGap) => setYearGap(yearGap)}
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                </Stack>
                <Stack spacing={3}>
                  <Text>
                    {t.ratinggap} {String(ratingGap).match(/.{1,2}/g)}
                  </Text>
                  <RangeSlider
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={[0, 100]}
                    onChangeEnd={(ratingGap) => setRatingGap(ratingGap)}
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                </Stack>
              </Stack>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              {t.cancel}
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                (value || genre || sort || order || ratingGap || yearGap) &&
                  router.push(
                    `/?keyword=${value}&genre=${genre}&sort_by=${sort}&order_by=${order}&year_gap=${yearGap}&ratingGap=${ratingGap}`
                  );
                onClose();
                setSort("");
                setOrder("");
                setValue("");
              }}
            >
              {t.advancedsearch}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchButton;
