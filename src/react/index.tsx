import React, { useEffect } from 'react';
import  {
  EmbeddedExplorer,
  EmbeddableExplorerOptions,
} from '../EmbeddedExplorer'

const DEFAULT_ELEMENT_ID = 'apollo-explorer';

export const ApolloExplorerReact = (
  props: Omit<EmbeddableExplorerOptions, 'target'> & {
    className?: string;
    target?: string;
  }
) => {
  useEffect(() => {
    new EmbeddedExplorer({ ...props, target: props.target ?? `#${DEFAULT_ELEMENT_ID}`});
  }, [props]);

  return (
    <div className={props.className} id={props.target?.substring(1) ?? DEFAULT_ELEMENT_ID} />
  );
};

