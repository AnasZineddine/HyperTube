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
} from "@chakra-ui/react";
import React from "react";
import { Search2Icon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const SearchButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const router = useRouter();

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
            <Input placeholder="Type here..." />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Search</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchButton;
