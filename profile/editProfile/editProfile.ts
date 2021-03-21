import { exists } from "https://deno.land/std@0.90.0/fs/mod.ts";
import { buildProfile } from "../buildProfile/buildProfile.ts";
import {createProfile} from '../createProfile/createProfile.ts';

export const checkExistingUser = async (name: string): Promise<boolean> => {
  const fileExists = await exists(`./users/${name}.json`);

  return fileExists;
};

export const getUserData = async (name: string): Promise<void> => {
  const fileName = `./users/${name}.json`;
  const file = await Deno.readTextFile(fileName);
  const profile = JSON.parse(file);

  // now that we have profile -- update as needed
  const flags = Deno.args.slice(2, Deno.args.length);
  const user = buildProfile(flags, profile)
  await createProfile(user, true)
};
