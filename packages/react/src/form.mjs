'use client';
import { createElement, useEffect, useRef } from 'react';
import { enhanceForm } from '@saral/core';

/** @typedef {import('react').FormHTMLAttributes<HTMLFormElement>} FormProps */

/**
 * A normal form that posts even before this script loads. Once it runs,
 * errors show inline and the submit button is marked pending.
 * @param {FormProps} props
 */
export function Form({ children, ...rest }) {
  const ref = useRef(/** @type {HTMLFormElement | null} */ (null));
  useEffect(() => {
    if (!ref.current) return undefined;
    const handle = enhanceForm(ref.current);
    return () => handle.destroy();
  }, []);
  return createElement('form', { ...rest, ref }, children);
}
