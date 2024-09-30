import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { db, createMessage, getCurrentUser } from '../utils/firebase';
import { collection, orderBy, onSnapshot, query, doc } from "firebase/firestore";
import styled, { ThemeContext } from "styled-components/native";
import { Alert } from "react-native";
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { MaterialIcons } from '@expo/vector-icons';


const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const SendButton = props => {
    const theme = useContext(ThemeContext);

    return (
        <Send
            {...props}
            disabled={!props.text}
            containerStyle={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 4,
            }}
        >
            <MaterialIcons
                name="send"
                size={24}
                color={
                    props.text ? theme.sendButtonActivate : theme.sendButtonInactivate
                }
            />
        </Send>
    );
};

const Channel = ({ navigation, route: {params} }) => {
    const theme = useContext(ThemeContext);
    const { uid, name, photoUrl } = getCurrentUser();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    
    useEffect(() => {
        const docRef = doc(db, 'channels', params.id);
        const runquery = query(
            collection(db, `${docRef.path}/messages`),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(runquery, snapshot => {
            const list = [];
            snapshot.forEach(doc => {
                list.push(doc.data());
            });
            setMessages(list);
        });
        return () => unsubscribe();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: params.title || 'Channel'});
    }, []);

    const _handleMessageSend = async messageList => {
        const newMessage = messageList[0];
        try {
            await createMessage({ channelId: params.id, text: newMessage });
        } catch (e) {
            Alert.alert('Send Message Error', e.message);
        }
    };

    return (
        <Container>
            <GiftedChat
                listViewProps={{
                    style: { backgroundColor: theme.background },
                }}
                placeholder="Enter a message..."
                messages={messages}
                user={{ _id: uid, name, avatar: photoUrl }}
                onSend={_handleMessageSend}
                alwaysShowSend={true}
                textInputProps={{
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    textContentType: 'none',
                    underlineColorAndroid: 'transparent',
                }}
                multiline={false}
                renderUsernameOnMessage={true}
                scrollToBottom={true}
                renderSend={props => <SendButton {...props} />}
            />
        </Container>
    );
};

export default Channel;