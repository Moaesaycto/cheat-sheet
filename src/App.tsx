import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css'
import actions from './actions.json'
import { PrismRefs, Titles, useLanguageContext, type Language } from './language';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { highlightElement } from 'prismjs';
import 'prismjs/themes/prism-one-light.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs';

type ActionProps = {
  description: string;
  py?: string | null;
  java?: string | null;
  c?: string | null;
  js?: string | null;
}


function App() {
  const { language, setLanguage } = useLanguageContext();
  const [filter, setFilter] = useState<string>("");

  const tables = useMemo(() => {
    return actions.reduce<Record<string, ActionProps[]>>((a, o) => {
      if (o.description.toLowerCase().includes(filter.toLowerCase()) && o[language]) (a[o.category] ||= []).push(o);
      return a;
    }, {});
  }, [filter, language]);


  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex bg-neutral-200 justify-center">
        <div className="w-full max-w-6xl flex flex-row gap-2 items-center">
          <img src={`assets/${language}.png`} className="h-16" />
          <div>
            <span>Cheat Sheet</span>
            <div className="flex text-sm gap-3">
              <span>
                Selected language:
              </span>
              <select
                className="font-bold"
                onChange={(e) => {
                  setLanguage(e.target.value as Language);
                }}
              >
                {Object.entries(Titles).map(([key, val], v) => {
                  return <option value={key} key={v}>
                    {val}
                  </option>
                })}
              </select>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 border-solid p-5 flex justify-center">
        <div className="flex flex-col gap-5 w-full max-w-6xl">
          <input
            placeholder='Search action...'
            className="border border-neutral-400 placeholder:text-neutral-400 px-2"
            onChange={(e) => setFilter(e.target.value)}
          />

          {Object.entries(tables).map(([e, v], k) => {
            return tables && <CategoryRender title={e} actions={v} key={k} />
          })}
        </div>

      </main>
      <footer>{language}</footer>
    </div>
  )
}


const CategoryRender = ({ title, actions }: { title: string, actions: ActionProps[] }) => {
  const [open, setOpen] = useState<boolean>(true);

  const sorted = useMemo(() => {
    return [...actions].sort((a, b) => a.description.localeCompare(b.description));
  }, [actions]);


  return (sorted ?
    <div>
      <div
        onClick={() => setOpen(!open)}
        className={`w-full h-10px px-2 bg-neutral-300 flex justify-between items-center
          font-bold uppercase hover:cursor-pointer hover:bg-neutral-400`}
      >
        <span className="flex-1 text-center">
          {title}
        </span>
        {open ? <ChevronUpIcon className="" /> : <ChevronDownIcon />}
      </div>
      {open &&
        <div className="bg-neutral-100">
          {sorted.map((e, v) => {
            return <ActionRender action={e} key={v} />
          })}
        </div>
      }
    </div> : null
  )
}

const ActionRender = ({ action }: { action: ActionProps }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { language } = useLanguageContext();
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open && codeRef.current) {
      highlightElement(codeRef.current);
    }
  }, [open, language, action]);

  return (
    <div
      className={`hover:bg-neutral-200 ${open ? "bg-neutral-200" : ""}`}
    >
      <div
        className="px-3 text-sm flex justify-between items-center hover:cursor-pointer"
        onClick={() => { setOpen(!open) }}
      >
        <span>{action.description}</span>
        {open ? <ChevronUpIcon className="" /> : <ChevronDownIcon />}
      </div>
      {open &&
        <div className="bg-neutral-500">
          <pre
            ref={codeRef as any}
            className={`language-${PrismRefs[language]} py-0! ml-2! my-0! rounded-none! text-sm`}
          >
            {action[language]}
          </pre>
        </div>
      }
    </div>
  );
}

export default App
