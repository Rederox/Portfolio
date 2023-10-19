
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'Image',
  title: 'Image',
  type: 'document',
  fields: [
    {
        name:"heroImage",
        title:"Image",
        type:"image",
        options:{
          hotspot: true,
        }
    },
    {
        name: "name",
        title:"Name",
        type:"string",
      },
  ],
})
