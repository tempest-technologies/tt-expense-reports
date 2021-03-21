import { exists } from "https://deno.land/std@0.90.0/fs/mod.ts";

export const createProfile = async (profile: {[key:string]: string | string[]}, skipFolderCheck = false): Promise<void> => {
  // needs access to file system


  if (!skipFolderCheck) {
    const folderExists = await exists("./users");

    if (!folderExists) {
      await Deno.mkdir('./users')
    }
  }
  const stringified = JSON.stringify(profile)
  const fileName = `./users/${profile.name}.json`
  await Deno.writeTextFile(fileName, stringified)
};