import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
 
// Tùy chọn rehype-pretty-code (tô màu bằng Shiki)
const prettyCodeOptions = {
  theme: 'github-dark',     // Theme tối cho code block
  keepBackground: true,      // Giữ màu nền của theme
  defaultLang: 'plaintext',  // Ngôn ngữ mặc định khi không chỉ định
}
 
export async function compileMDXContent(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
  })
 
  return content
}
