import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
// @ts-ignore
import { highlight } from 'sugar-high'
import React from 'react'

function Table({ data }: { data: { headers: string[], rows: string[][] } }) {
  let headers = data.headers.map((header: string, index: number) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props: { href: string, children: React.ReactNode }) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      // @ts-ignore
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props: { alt: string, children: React.ReactNode }) {
  // @ts-ignore
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }: { children: React.ReactNode, props: any }) {
  // @ts-ignore
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    // @ts-ignore
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
}


export async function CustomMDX({
  source,
  components: customComponents,
  ...rest
}: {
  source: string
  components?: Record<string, unknown>
}) {
  return (
    <MDXRemote
      source={source}
      {...rest}
      components={{ ...components, ...(customComponents || {}) }}
    />
  )
}
