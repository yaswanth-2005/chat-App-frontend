import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./singleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="rgba(255, 255, 255, 0.1)"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
            border="3px solid rgba(255, 255, 255, 0.3)"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default Chatbox;