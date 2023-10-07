export type MockData = {
    names: string[],
    descriptions: string[],
    previewImages: string[],
    propertyImages: string[],
    coordinates: {
      latitude: number[],
      longitude: number[]
    },
    users: {
      names: string[],
      avatars: string[],
      emails: string[],
      passwords: string[]
    }
  }