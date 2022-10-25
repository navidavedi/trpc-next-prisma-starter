import { trpc } from '../utils/trpc'

import { inferProcedureInput } from '@trpc/server'
import {
  Code,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea
} from '@chakra-ui/react'
import { AppRouter } from '~/server/routers/_app'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import ReactSelectCreatable from 'react-select/creatable'

const AddPost = () => {
  const [selectedTags, setSelectedTags] = useState([])
  const utils = trpc.useContext()
  const getTagList = trpc.tag.list.useQuery()
  const tagRef = useRef(null)
  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      await utils.post.list.invalidate()
    }
  })

  const addTag = trpc.tag.add.useMutation()

  const handleCreateTag = async (e: any) => {
    await addTag.mutateAsync({ title: e })
    await getTagList.refetch()
  }
  console.log('selectedTags', selectedTags)
  const router = useRouter()
  return (
    <>
      <Heading size="lg">Add a Post</Heading>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const $form = e.currentTarget
          const values = Object.fromEntries(new FormData($form))
          type Input = inferProcedureInput<AppRouter['post']['add']>

          const input: Input = {
            title: values.title as string,
            text: values.text as string,
            tags: selectedTags.map((el: any) => ({
              id: el.value,
              title: el.label
            }))
          }
          try {
            await addPost.mutateAsync(input)

            $form.reset()
            router.push('/')
          } catch (cause) {
            console.error({ cause }, 'Failed to add post')
          }
        }}
      >
        <label htmlFor="title">Title:</label>
        <br />
        <Input
          id="title"
          name="title"
          type="text"
          disabled={addPost.isLoading}
        />

        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <Textarea id="text" name="text" disabled={addPost.isLoading} />
        <br />
        <FormControl p={4}>
          <FormLabel>
            Select Colors and Flavours <Code size="md"> (default)</Code>
          </FormLabel>
          <ReactSelectCreatable
            isMulti
            name="Tags"
            options={getTagList.data?.map((el) => ({
              label: el.title,
              value: el.id
            }))}
            placeholder="Select some Tags..."
            closeMenuOnSelect={false}
            ref={tagRef}
            onChange={(e: any) => setSelectedTags(e)}
            onCreateOption={(e) => handleCreateTag(e)}
          />
        </FormControl>
        <Input type="submit" disabled={addPost.isLoading} />
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
    </>
  )
}

export default AddPost
