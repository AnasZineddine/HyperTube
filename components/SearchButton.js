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
    "All",
    "Comedy",
    "Action",
    "Horror",
    "Sci-fi",
    "Romance",
    "Thriller",
    "Drama",
    "Adventure",
    "Animation",
    "Documentary",
    "Crime",
  ];
  return (
    <>
      <IconButton ref={btnRef} onClick={onOpen} icon={<Search2Icon />} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search movies</DrawerHeader>
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
                }}
              >
                Quick Search
              </Button>
              <Divider p={1} />
              <Stack pt={10} spacing={10}>
                <HStack>
                  <Select
                    variant="filled"
                    placeholder="Sort by"
                    onChange={handleChange2}
                  >
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="released">Released</option>
                    <option value="trending">Trending</option>
                    <option value="updated">Updated</option>
                    <option value="year">Year</option>
                  </Select>
                  <Select
                    variant="filled"
                    placeholder="Order"
                    onChange={handleChange3}
                  >
                    <option value="1">Ascending</option>
                    <option value="-1">Descending</option>
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
                  <Text>Year gap {String(yearGap).match(/.{1,4}/g)}</Text>
                  <RangeSlider
                    min={1920}
                    max={2021}
                    step={5}
                    defaultValue={[1920, 2021]}
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
                  <Text>Rating gap {String(ratingGap).match(/.{1,2}/g)}</Text>
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
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                (value || genre || sort || order) &&
                  router.push(
                    `/?keyword=${value}&genre=${genre}&sort_by=${sort}&order_by=${order}`
                  );
                onClose();
                setSort("");
                setOrder("");
              }}
            >
              Advanced Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchButton;
