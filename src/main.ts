import * as core from '@actions/core'
import {DockerHubService} from './dockerhub.service'

async function run(): Promise<void> {
  try {
    let exactMatch = false
    let prefixMatch = false
    const username: string = core.getInput('username')
    const password: string = core.getInput('password')
    const namespace: string = core.getInput('namespace')
    const repository: string = core.getInput('repository')
    const tag: string = core.getInput('tag')

    const dockerhub: DockerHubService = new DockerHubService(username, password)
    const tags: string[] = await dockerhub.getTags(namespace, repository)

    for (const dockerTag of tags) {
      if (dockerTag.toLowerCase() === tag.toLowerCase()) {
        exactMatch = true
      }
      if (
        dockerTag.toLowerCase().startsWith(tag.toLowerCase()) ||
        tag.toLowerCase().startsWith(dockerTag.toLowerCase())
      ) {
        prefixMatch = true
      }
    }

    core.setOutput('exact-match', exactMatch)
    core.setOutput('prefix-match', prefixMatch)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
