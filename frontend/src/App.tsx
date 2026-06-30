import { useState } from "react"
import "./index.css"
import { postApi } from "./api";

export function App()
{
  const [output, setOutput] = useState( {} );
  const [language, setlanguage] = useState( "js" );
  const [ code ,setCode ] = useState("");

  return <div className="h-screen">
        <div className="h-20 border-b flex justify-center gap-100 items-center">
          <select
            className="border rounded-2xl px-10 py-2 text-blue-600 border-blue-400 outline-blue-500"
          >
            <option value="js">js</option>
            <option value="python">python</option>
            <option value="c">c</option>
            <option value="c++">c++</option>
            <option value="java">java</option>
          </select>

          <button
            className="px-10 py-2 border rounded-2xl"
            onClick={async () => {
              console.log(language);
              console.log(code);

              const res = await postApi({ code, language });
              setOutput(res);
            }}
          >
            Run
          </button>
        </div>

        <div className="flex h-full">
          <div className="flex-1 border-r">
            <textarea
              className="w-full h-full px-5 py-3"
              onChange={(e) => {
                console.log(e.target.value);
                setCode(e.target.value);
              }}
            />
          </div>

          <div className="flex-1 px-4 py-3">
            <div>
              `=============== your output ============`
            </div>

            <div>
              <p> { output["status"] } </p>
              <p> { output["result"] } </p>
            </div>
          </div>
        </div>
</div>
}