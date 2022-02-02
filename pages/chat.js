import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useEffect, useState } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../scr/components/SendStickerButton";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY1NzQ5MSwiZXhwIjoxOTU5MjMzNDkxfQ.o4VlbHygNymn68tSNEH8GsC0OXUQ7ERZ-KXmWllhY5U";
const SUPABASE_URL = "https://edakrcazvrbocfujersc.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
    const routing = useRouter();
    const loggedUser = routing.query.username;

    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    // Sua lógica vai aqui

    function realTimeMessagesListener(addMessage) {
        return supabaseClient
            .from("messages")
            .on("INSERT", (res) => {
                addMessage(res.new);
            })
            .subscribe();
    }

    useEffect(() => {
        supabaseClient
            .from("messages")
            .select("*")
            .order("id", { ascending: false })
            .then(({ data }) => {
                setMessageList(data);
            });

        realTimeMessagesListener((newMessage) => {
            console.log("Nova mensagem: ", newMessage);
            setMessageList((CurrentMessageList) => {
                return [newMessage, ...CurrentMessageList];
            });
        });
    }, []);

    function handleNewMessage(newMessage) {
        const message = {
            // id: messageList.length + 1,
            from: loggedUser,
            text: newMessage,
        };

        supabaseClient
            .from("messages")
            .insert([
                // Tem que ser um objeto com os mesmos atributos que você criou no banco de dados!
                message,
            ])
            .then(({ data }) => {
                console.log("Criando nova mensagem: ", data);
            });

        setMessage("");
    }
    // Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/07/coffee-shop.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                color: appConfig.theme.colors.neutrals["000"],
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    borderRadius: "5px",
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: "column",
                        borderRadius: "5px",
                        padding: "16px",
                    }}
                >
                    {/* {messageList.map((currentMessage) => {
                        return (
                            <li key={currentMessage.id}>
                                {currentMessage.from}: {currentMessage.text}
                            </li>
                        );
                    })} */}
                    <MessageList messages={messageList} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(e) => {
                                const value = e.target.value;
                                setMessage(value);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(":sticker:" + sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text variant="heading5">Chat</Text>
                <Button
                    variant="tertiary"
                    colorVariant="neutral"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}

function MessageList({ messages }) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: "16px",
            }}
        >
            {messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            hover: {
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[700],
                            },
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "end",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text tag="strong">{message.from}</Text>
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date().toLocaleDateString()}
                            </Text>
                        </Box>
                        {/* Declarativo */}
                        {/* condicional:
                        {message.text.startsWith(":sticker:").toString() */}

                        {message.text.startsWith(":sticker:") ? (
                            <Image
                                src={message.text.replace(":sticker:", "")}
                            />
                        ) : (
                            message.text
                        )}
                    </Text>
                );
            })}
        </Box>
    );
}
