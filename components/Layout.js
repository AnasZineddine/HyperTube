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
      {children}
      <Footer />
    </Flex>
  );
};

export default Layout;
