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
} from "@chakra-ui/react";
import React from "react";
import { Search2Icon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const SearchButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const handleChange = (event) => setValue(event.target.value);

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
