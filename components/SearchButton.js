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
  const handleChange = (event) => setValue(event.target.value);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: "All",
    onChange: console.log,
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
    "Superhero",
    "Mystery",
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
                Quick search
              </Button>
              <Stack pt={10} spacing={10}>
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

                <RangeSlider
                  min={1920}
                  max={2021}
                  step={5}
                  defaultValue={[1920, 2021]}
                  onChangeEnd={(val) => console.log(val)}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
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
                value && router.push(`/?keyword=${value}`);
                onClose();
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
