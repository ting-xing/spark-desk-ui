import {useMemo, useState} from 'react'
import './App.css'
import {Input, RadioGroup} from "@chatui/core";
import SparkDeskUI from "./components/spark-desk-ui/SparkDeskUI.tsx";
import {RadioProps} from "@chatui/core/lib/components/Radio/Radio";
import {SparkDesk} from "spark-desk";

const options: Array<RadioProps> = [
    {label: 'v1', value: 1},
    {label: 'v2', value: 2},
    {label: 'v3', value: 3},
    {label: 'v3.5', value: 3.5},
];


function App() {

    const [version, setVersion] = useState(3.5);

    const [appId, setAppID] = useState("")
    const [apiSecret, setApiSecret] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [systemContent, setSystemContent] = useState("你现在扮演李白，你豪情万丈，狂放不羁；接下来请用李白的口吻和用户对话。")
    const sparkDesk = useMemo(() => {
        return new SparkDesk({
            APPID: appId,
            APISecret: apiSecret,
            APIKey: apiKey,
            version: version,
        });
    }, [appId, apiSecret, apiKey, version])

    const user = useMemo(() => {
        const user = sparkDesk.createUser("spark-desk-ui", 0)

        if (systemContent.trim().length > 0) {
            user.setSystemContent(systemContent)
        }

        return user;
    }, [sparkDesk])

    return (
        <main className={"flex gap-20 h-full"}>
            <div>
                <ul className={"flex flex-col gap-10 list-none text-stone-600"}>
                    <li>
                        <strong>版本</strong>
                        <RadioGroup options={options} value={version} onChange={value => setVersion(value as number)}/>
                    </li>
                    <li>
                        <strong>APPID</strong>
                        <Input placeholder="APPID" value={appId} onChange={setAppID}></Input>
                    </li>
                    <li>
                        <strong>APISecret</strong>
                        <Input placeholder="APISecret" value={apiSecret} onChange={setApiSecret}></Input>
                    </li>
                    <li>
                        <strong>APIKey</strong>
                        <Input placeholder="APIKey" value={apiKey} onChange={setApiKey}></Input>
                    </li>
                    <li>
                        <strong>systemContent</strong>
                        <Input rows={6} value={systemContent} onChange={setSystemContent}></Input>
                    </li>
                </ul>


            </div>
            <div className={"h-full w-120"}>
                <SparkDeskUI user={user}/>
            </div>

        </main>
    )
}

export default App
