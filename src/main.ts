import * as core from '@actions/core'
import {DockerHubService} from './dockerhub.service'

async function run(): Promise<void> {
  try {
    const username: string = core.getInput('username')
    const password: string = core.getInput('password')
    const image: string = core.getInput('image')
    const tag: string = core.getInput('tag')

    const dockerhub: DockerHubService = new DockerHubService(username, password)
    core.setOutput('tag-exists', await dockerhub.tagExists(image, tag))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
