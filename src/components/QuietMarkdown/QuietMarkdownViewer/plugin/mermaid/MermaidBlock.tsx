import React, { useContext, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { v4 as uuid } from 'uuid';
import { GlobalContext } from '@/context';

const Foo = React.memo((props: { code: string }) => {
  const { theme } = useContext(GlobalContext);

  const ref = useRef(null);
  useEffect(() => {
    if ('light' === theme) {
      mermaid.mermaidAPI.initialize({ theme: 'default' });
    } else {
      mermaid.mermaidAPI.initialize({ theme: 'dark' });
    }
    if (ref.current) {
      try {
        mermaid.render(
          'mermaid' + uuid().replaceAll(/[\s|-]/g, ''),
          props.code,
          (svgCode) => (ref.current.innerHTML = svgCode)
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, [props.code, theme]);

  return <div ref={ref} />;
});

export default Foo;
