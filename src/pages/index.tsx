import { trpc } from '../utils/trpc'
import { NextPageWithLayout } from './_app'

import { Fragment } from 'react'
import { Button, Container, Flex, Heading } from '@chakra-ui/react'
import { Link } from '~/components/Link'

const IndexPage: NextPageWithLayout = () => {
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor
      }
    }
  )

  return (
    <Container maxWidth={'container.lg'}>
      <Heading size="lg" pb="10" pl="10" mt={10}>
        Simple blog
      </Heading>
      <Flex px="10" align="center">
        <Button
          onClick={() => postsQuery.fetchPreviousPage()}
          disabled={
            !postsQuery.hasPreviousPage || postsQuery.isFetchingPreviousPage
          }
        >
          {postsQuery.isFetchingPreviousPage
            ? 'Loading more...'
            : postsQuery.hasPreviousPage
            ? 'Load More'
            : 'Nothing more to load'}
        </Button>
        <Heading size="sm" mr="auto" ml="2">
          {postsQuery.data?.pages.length}{' '}
          {postsQuery.data?.pages.length === 1 ? 'page' : 'pages'} loaded
          {postsQuery.status === 'loading' && '(loading)'}
        </Heading>

        <Link href={`/add-post`} ml="auto">
          <Button colorScheme="blue">Add a post</Button>
        </Link>
      </Flex>

      {postsQuery.data?.pages.map((page, index) => (
        <Fragment key={page.items[0]?.id || index}>
          {page.items.map((item) => (
            <article key={item.id}>
              <Flex
                bg="teal"
                px="10"
                rounded={7}
                p={4}
                m={10}
                color="white"
                justify="space-between"
                align="center"
              >
                <Heading size="md">{item.title}</Heading>

                <Link href={`/post/${item.id}`}>
                  <Button colorScheme="teal">View more</Button>
                </Link>
              </Flex>
            </article>
          ))}
        </Fragment>
      ))}
    </Container>
  )
}

export default IndexPage
