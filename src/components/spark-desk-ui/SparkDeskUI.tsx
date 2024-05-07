import React, {useEffect} from "react";
import Chat, {Bubble, useMessages} from "@chatui/core";
import {ComposerProps} from "@chatui/core/lib/components/Composer";
import {MessageContainerProps} from "@chatui/core/lib/components/MessageContainer";
import {User} from "spark-desk";
import {QuickReplyItemProps} from "@chatui/core/lib/components/QuickReplies";
import {DefaultUser, SparkDeskUser} from "./user.ts";

export interface SparkDeskUIProps {
    user: User
}

const defaultQuickReplies = [
    {
        icon: 'message',
        name: '你是谁?',
        isNew: true,
        isHighlight: true,
    },
    {
        name: '你会做什么?',
        isNew: true,
    }
];


export const SparkDeskUI: React.FC<SparkDeskUIProps> = (props) => {

    const {messages, appendMsg, setTyping, deleteMsg} = useMessages([]);


    const handleSend: ComposerProps['onSend'] = (type, val) => {
        if (type === 'text' && val.trim()) {
            appendMsg({
                type: 'text',
                content: {text: val},
                position: 'right',
                user: DefaultUser
            });

            setTyping(true);

            props.user.speak(val).then(res => {
                appendMsg({
                    type: 'text',
                    content: {text: res.getAllContent()},
                    user: SparkDeskUser
                });
            }).catch(() => {
                appendMsg({
                    type: 'text',
                    content: {text: "内部错误，请打开控制台调试."},
                    user: SparkDeskUser
                });
            })

        }
    }

    function handleQuickReplyClick(item: QuickReplyItemProps) {
        handleSend("text", item.name)
    }

    const renderMessageContent: MessageContainerProps['renderMessageContent'] = (msg) => {
        const {content} = msg;
        return <Bubble content={content.text}/>;
    }

    useEffect(() => {
        appendMsg({
            type: 'text',
            content: {text: "请完整、正确的填写APPID、APISecret、APIKey 参数后再发送消息。"},
            user: SparkDeskUser,
            _id: "dev"
        })

        return function () {
            deleteMsg("dev")
        }
    }, []);

    return <Chat
        navbar={{title: 'SparkDeskUI'}}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
        quickReplies={defaultQuickReplies}
        onQuickReplyClick={handleQuickReplyClick}
        text={"你是谁?"}
    />
}

export default SparkDeskUI;