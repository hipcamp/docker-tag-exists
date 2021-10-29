/* eslint-disable filenames/match-regex */
import axios, {AxiosResponse} from 'axios'

export class DockerHubService {
  private readonly dockerURL = 'https://hub.docker.com'
  private readonly username: string
  private readonly password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  private async getAuthenticationToken(): Promise<string> {
    const result: AxiosResponse = await axios.post(
      `${this.dockerURL}/v2/users/login`,
      {
        username: this.username,
        password: this.password
      }
    )

    return result.data.token
  }

  async getTags(
    namespace: string,
    repository: string,
    nextURL: string | null = null
  ): Promise<string[]> {
    const token: string = await this.getAuthenticationToken()
    const url: string = nextURL
      ? nextURL
      : `${this.dockerURL}/v2/namespaces/${namespace}/repositories/${repository}/images`
    const result: AxiosResponse = await axios.get(url, {
      headers: {Authorization: `Bearer ${token}`}
    })

    let tags: string[] = []

    for (const image of result.data.results) {
      for (const tag of image.tags) {
        if (tag.is_current) {
          tags.push(tag.tag)
        }
      }
    }

    if (result.data.next) {
      tags = tags.concat(
        await this.getTags(namespace, repository, result.data.next)
      )
    }

    return tags
  }
}
