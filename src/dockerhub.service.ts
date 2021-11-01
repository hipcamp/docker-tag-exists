/* eslint-disable filenames/match-regex */
import axios, {AxiosRequestHeaders, AxiosResponse} from 'axios'

export class DockerHubService {
  private readonly dockerURL = 'https://hub.docker.com'
  private readonly username: string
  private readonly password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  private async getAuthenticationToken(): Promise<string> {
    if (this.username && this.password) {
      const result: AxiosResponse = await axios.post(
        `${this.dockerURL}/v2/users/login`,
        {
          username: this.username,
          password: this.password
        }
      )
      return result.data.token
    } else {
      return ''
    }
  }

  async tagExists(image: string, tag: string): Promise<boolean> {
    const token: string = await this.getAuthenticationToken()
    const url = `${this.dockerURL}/v2/repositories/${image}/tags/${tag}`
    const headers: AxiosRequestHeaders = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const result: AxiosResponse = await axios.get(url, {
      headers
    })
    return result.status === 200
  }
}
