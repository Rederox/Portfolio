import { sanityClient } from '@/sanity';
import { Experience, Skill, Social } from '@/typings';
import type {NextApiRequest, NextApiResponse} from 'next'
import {groq} from "next-sanity";
import { SanityClient } from 'next-sanity';

const query = groq`
    *[_type == "experience"] | order(!isCurrentlyWorkingHere, dateEnded desc){
      ...,
      technologies[]->
    }
`

type Data = {
  experiences: Experience[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {
    const experiences:Experience[] = await sanityClient.fetch(query);

    res.status(200).json({experiences});
  }