import { flags } from "./flags.ts";
import { defaultProfile, projects } from "./constants.ts";

export const buildProfile = (
  args: string[],
  profile?: { [key: string]: string | string[] }
): { [key: string]: string | string[] } => {
  const user: { [key: string]: string | string[] } = profile || defaultProfile;
  const argsLength = args.length;
  // go through args --
  // create object mapping
  for (const argIndex in args) {
    const index = Number.parseInt(argIndex);

    if (args[argIndex].match(/^(--|-)/) && index < argsLength) {
      // grab next position if we're not at the end of the array
      const flag: string = args[argIndex];
      const flagName: string = flags[flag];
      
      // if the flagName exists -- aka in flags
      if (flagName) {
        const data = args[index + 1]
        
        if (flagName === 'project') {
          const projectNumbers = data.split(', ')
          user['project names'] = []
          user['project numbers'] = []

          for (const projectNumber of projectNumbers) {
            const projectName = projects[projectNumber];
            (user['project names'] as string[]).push(projectName);
            (user['project numbers'] as string[]).push(projectNumber)
          }
        }

        if (Object.keys(user).includes(flagName)) {
          user[flagName] = data
        }
      }
    }
  }

  return user;
};
