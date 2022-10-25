import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  Tag,
  Text
} from '@chakra-ui/react'
import NextError from 'next/error'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '~/pages/_app'
import { trpc } from '~/utils/trpc'

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string
  const postQuery = trpc.post.byId.useQuery({ id })

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    )
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>
  }
  const {
    data: { createdAt, title, text, updatedAt, tags }
  } = postQuery

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  const date = new Date(updatedAt || createdAt)

  return (
    <Container maxWidth={'container.lg'} mt={10}>
      <Breadcrumb spacing="8px" fontSize={14}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/post/${id}`}>{title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading mt={7} mb={1}>
        {title}
      </Heading>
      <Text fontWeight={300} fontSize={14}>
        {date.toLocaleDateString('en-US', options)}
      </Text>
      {tags.map((tag) => (
        <Tag m={1} key={tag.id}>
          {tag.title}
        </Tag>
      ))}
      <Text>{text}</Text>
    </Container>
  )
}

export default PostViewPage
