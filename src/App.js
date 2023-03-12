import "./styles.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import TextField from "@mui/material/TextField";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SendIcon from "@mui/icons-material/Send";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  var profile = {
    id: ""
  };
  useEffect(() => {
    profile.id = Math.random();
  }, []);

  const addMessage = (message) => {
    const box = document.getElementById("card");
    box.scrollTop = box.scrollHeight;
    messages.push(
      new Message({
        id: 1,
        message
      })
    );
    setIsTyping(true);

    var data = JSON.stringify({
      question: message,
      userid: profile.id
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://wiry-encouraging-hoodie.glitch.me/chat",
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        const answer = response.data.content;
        messages.push(
          new Message({
            id: 0,
            message: answer
          })
        );
        setLastMessage(answer);
        setIsTyping(false);
        const box = document.getElementById("card");
        box.scrollTop = box.scrollHeight;
      })
      .catch(function (error) {
        console.log(error);
      });
    //    document.getElementById("card").scrollIntoView(false);
    //.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    axios
      .get("https://wiry-encouraging-hoodie.glitch.me/prompts")
      .then((data) => {
        setRoles(data.data);
        //setData(data);
      });
  }, []);

  return (
    <>
      <React.Fragment key="right">
        <Drawer
          anchor="right"
          open={isOpen}
          onClose={() => {}}
          style={{ textAlign: "left" }}
        >
          <div style={{ width: "100%", textAlign: "end" }}>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              X
            </Button>
          </div>
          <MenuList dense>
            {roles.map((r) => (
              <MenuItem key={r.act}>
                <ListItemText
                  onClick={() => {
                    setIsOpen(false);
                    addMessage(r.prompt);
                  }}
                  inset
                >
                  {r.act}
                </ListItemText>
                <Divider />
              </MenuItem>
            ))}
          </MenuList>
        </Drawer>
      </React.Fragment>
      <div className="main">
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          style={{ width: "100%" }}
        >
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Act as
          </Button>
        </ButtonGroup>
        <Card>
          <CardContent
            id="card"
            style={{ minWidth: 275, height: "60vh", "overflow-y": "auto" }}
            onClick={() => {
              navigator.share({
                title: "share",
                text: lastMessage,
                url: "https://73otgx.csb.app/"
              });
            }}
          >
            <ChatFeed
              messages={messages} // Array: list of message objects
              isTyping={isTyping} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName // show the name of the user who sent the message
              bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
              // JSON: Custom bubble styles
              bubbleStyles={{
                chatbubble: {
                  borderRadius: 5,
                  padding: 10
                },
                text: {
                  fontFamily: "Verdana"
                }
              }}
            />
          </CardContent>
        </Card>
        <div>
          <TextField
            id="message"
            multiline
            rows={4}
            variant="standard"
            style={{ width: "70vw" }}
          />
          <Button
            variant="contained"
            style={{ width: "20vw", margin: "10px" }}
            endIcon={<SendIcon />}
            onClick={() => {
              const msg = document.getElementById("message").value;
              document.getElementById("message").value = "";
              addMessage(msg);
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
