/**
 * Goal here is to create an expense report generator
 * Some sub tasks include:
 *      * create profiles -- json object
 *      * add a way to edit profile by project / project number / project manager / project coordinator
 *      * add ability to add receipts / amounts
 *      * load profiles into script
 *      * open excel
 *      * plug in profile from json object
 *      * create new excel doc
 *
 */

import { buildProfile } from "./profile/buildProfile/buildProfile.ts";
import { createProfile } from "./profile/createProfile/createProfile.ts";
import {
  checkExistingUser,
  getUserData,
} from "./profile/editProfile/editProfile.ts";

const prompt = async (message = ""): Promise<string> => {
  const buffer = new Uint8Array(4);
  await Deno.stdout.write(new TextEncoder().encode(message));
  const num = <number>await Deno.stdin.read(buffer);
  const choice = new TextDecoder().decode(buffer.subarray(0, num)).trim();
  return choice;
};

if (Deno.args.length === 0) {
  let choice: number | Promise<string> | string | undefined;
  while (!choice || <number>choice > 3) {
    console.log(
      `Please choose a number from the following selection:\n1. create\n2. edit\n3. generate`
    );
    choice = Number.parseInt(await prompt("Selection: "));
    if (!choice || choice > 3) {
      console.clear();
    }
  }
  console.log(choice);
}

const commands = ["create", "edit", "generate"];
const command = Deno.args[0];
const argumentsLength = Deno.args.length;

if (!commands.includes(command)) Deno.exit(1);

if (command === "create") {
  const rest = Deno.args.slice(1, argumentsLength);
  const profile = buildProfile(rest);
  await createProfile(profile);
}

if (command === "edit") {
  // see if profile exists
  const name = Deno.args[1];
  const userExists = checkExistingUser(name);
  if (userExists) {
    await getUserData(name);
    Deno.exit();
  }
}

if (command === "generate") {
  // generate an expense report
  // check and see if we were given a name, should be arg[1]
  const name = Deno.args[1];

  if (!name) {
    console.log("Error: No name provided, stopping execution");
    Deno.exit(1);
  }

  // see if we have that file
  try {
    const userFile = JSON.parse(
      await Deno.readTextFile(`./users/${name}.json`)
    );
    // if we make it this far, we have that file, convert from json to js object

    // get file -- report.html / read it
    let reportFile = await Deno.readTextFile("./report/report.html");
    // go through each key in the profile
    
    for (const key in userFile) {
      // fill content by keys in profile
      // structure of text to find
      // <section class="{key}"></section>
      const data = userFile[key];
      reportFile = reportFile.replace(
        new RegExp(`class="${key}"><`),
        `class="${key}">${data}<`
      );
    }

    // now write to file
    await Deno.writeTextFile("./report/report.html", reportFile);
    
    // update last generated report date
    userFile['last-generated-report'] = userFile["expense request date"]
    // save the json file
    const jsonUserFile = JSON.stringify(userFile)
    await Deno.writeTextFile(`./users/${name}.json`, jsonUserFile)
    
  } catch (e) {
    console.log(e);
    console.log(`Did not find a profile under "${name}". Please try again`);
  }
}

/**
 * deno run --allow-read  --allow-write --unstable main.ts edit "Victor Tran" -p "105S017503, 105S017506" --erd 3/12/21 --dates 2/13/21--3/12/21 --p "City of Gulfport" --do "3/7/21, 2/28/21, 2/21/21, 2/14/21" -t 1/3/21 -h "Home2 Suites" -r n/a -ci 1/3/21 --red 3/31/21
 */
