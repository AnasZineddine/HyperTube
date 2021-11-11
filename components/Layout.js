import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Flex } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="stretch"
      justifyContent="flex-start"
    >
      <Navbar />
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Layout;
