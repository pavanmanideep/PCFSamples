![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Power%20Platform-blue)
![Type](https://img.shields.io/badge/Type-PCF%20Control-purple)
![Release](https://img.shields.io/badge/Release-v1.0.0-orange)

# Singapore NRIC/FIN Validator - PCF Control

A PowerApps Component Framework (PCF) control for validating Singapore NRIC/FIN (National Registration Identity Card) and FIN (Foreign Identification Number) numbers.

## Features

- ✅ Real-time validation of Singapore NRIC/FIN numbers
- ✅ Format validation (prefix, digits, checksum letter)
- ✅ Checksum algorithm verification
- ✅ Auto-formatting (converts to uppercase, removes invalid characters)
- ✅ Visual feedback with color-coded validation messages
- ✅ Supports all NRIC/FIN types: S, T, F, G, M prefixes
- ✅ Read-only mode support
- ✅ 9-character maximum length enforcement

## What is NRIC/FIN?

Singapore NRIC/FIN numbers are unique identification numbers issued to:
- **S prefix**: Singapore Citizens (born before 2000)
- **T prefix**: Singapore Citizens (born from 2000 onwards) and Permanent Residents
- **F prefix**: Foreigners (issued before 2000)
- **G prefix**: Foreigners (issued from 2000 onwards)
- **M prefix**: Foreigners (issued from 2022 onwards)

Format: `[Prefix][7 digits][Checksum Letter]` (e.g., S1234567D)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [.NET Framework 4.6.2 Developer Pack](https://dotnet.microsoft.com/download/dotnet-framework) or later
- [Power Platform CLI](https://aka.ms/PowerAppsCLI)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

## Installation

- Download the managed solution zip from the [Releases](https://github.com/pavanmanideep/Singapore-Identity-Number-Validator-PCFControl/releases) page.
- Go to your Power Platform / Dynamics 365 environment.
- Navigate to **Settings > Solutions** (or [make.powerapps.com](https://make.powerapps.com) → Solutions).
- Click **Import** and select the downloaded zip file.
- Follow the prompts to complete the import process.

### Project Structure

```
Singapore-Identity-Number-Validator-PCFControl/
├── SingaporeNricValidator/                    # PCF component source
│   ├── index.ts                               # Main component logic
│   ├── ControlManifest.Input.xml              # Component manifest
│   └── generated/                             # Auto-generated type definitions
├── EcellorsSingaporeNRICFINSolution/          # Solution wrapper for deployment
│   ├── EcellorsSingaporeNRICFINSolution.cdsproj
│   └── Other/
│       └── Solution.xml
├── package.json                               # NPM dependencies
├── tsconfig.json                              # TypeScript configuration
└── eslint.config.mjs                          # ESLint configuration
```

## Pushing the Control to a Power Platform Environment

### Option 1 – Quick push using `pac pcf push` (recommended for development)

Use this option to push directly to an environment without creating a full solution package.

```bash
# 1. Authenticate with your Power Platform environment
pac auth create --url https://<your-org>.crm.dynamics.com

# 2. Build the PCF control
npm run build

# 3. Push the control to the environment
pac pcf push --publisher-prefix ecellors
```

> **Note:** `pac pcf push` deploys the control directly and is best suited for development/testing. The control will be registered as `ecellors_SingaporeNRICFINValidatorControl` in the environment.

### Option 2 – Build and deploy a managed solution (recommended for production)

Use this option to create a managed solution zip file for importing into production environments.

```bash
# 1. Build the PCF control
npm run build

# 2. Build the solution package (generates a zip in EcellorsSingaporeNRICFINSolution/bin/Release/)
cd EcellorsSingaporeNRICFINSolution
msbuild /t:build /restore /p:configuration=Release

# 3. Import the generated zip to your environment
#    - Navigate to https://make.powerapps.com
#    - Go to Solutions → Import solution
#    - Select: EcellorsSingaporeNRICFINSolution/bin/Release/EcellorsSingaporeNRICFINSolution_managed.zip
```

## Usage in Power Apps

### Making customizations to this control

1. **Clone the Repo**

   ```bash
   git clone https://github.com/pavanmanideep/Singapore-Identity-Number-Validator-PCFControl.git
   cd Singapore-Identity-Number-Validator-PCFControl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the control**
   ```bash
   npm run build
   ```

4. **Push to your environment** (see [Pushing the Control](#pushing-the-control-to-a-power-platform-environment) above)

5. **Import to Power Apps**
   - Navigate to [Power Apps](https://make.powerapps.com)
   - Go to Solutions
   - Import the managed solution package available for this control
   - Open any entity form
     <img width="800" height="332" alt="image" src="https://github.com/user-attachments/assets/040e6bca-8ae5-4b72-a6da-b44db8ef8a94" />
     Next
     <img width="959" height="214" alt="image" src="https://github.com/user-attachments/assets/208fcaf7-2dc8-4584-b75b-1bc2ce551a38" />
     Create a single line text column, let's say we create Singapore NRIC/FIN 
     <img width="959" height="410" alt="image" src="https://github.com/user-attachments/assets/cf55c19b-803d-48cf-be4a-f0bb83839472" />
     Bind this field to control, by attaching it to a component
     <img width="935" height="314" alt="image" src="https://github.com/user-attachments/assets/d61f6d3f-a81b-47c9-8fe6-a2b36349fbb9" />

     




### Adding to a Form

1. Open your model-driven app or form
2. Select the field you want to replace with the NRIC validator
3. Click "Change component" or add a custom field
4. Select "ecellors_SingaporeNRICFINValidatorControl"
5. Configure the `nricValue` property to bind to your data field
6. Save and publish your form

### Component Properties

- **nricValue**: Bound text field that stores the NRIC/FIN number

### Validation Messages

- **Valid NRIC/FIN**: Green message "Valid NRIC/FIN."
- **Invalid Format**: Red message "Please enter a valid Singapore NRIC/FIN Number"
- **Empty Field**: Gray message "Enter NRIC/FIN."

## How the Validation Works

The control implements the official Singapore NRIC/FIN checksum algorithm:

1. **Format Check**: Verifies the format matches `[STFGM][7 digits][Letter]`
2. **Checksum Calculation**:
   - Multiply each digit by weights: [2, 7, 6, 5, 4, 3, 2]
   - Add offset based on prefix (T/G: +4, M: +3)
   - Calculate remainder when divided by 11
   - Compare with expected checksum letter

3. **Checksum Letter Sequences**:
   - S/T (Citizens): J, Z, I, H, G, F, E, D, C, B, A
   - F/G/M (Foreigners): X, W, U, T, R, Q, P, N, M, L, K

## Testing

Try these sample valid NRIC numbers in the test harness:

- S1234567D
- T1234567J
- F1234567N
- G1234567X
  
Model Driven Apps
  <img width="959" height="302" alt="image" src="https://github.com/user-attachments/assets/ad3623d0-2d5b-47c7-b337-29783db81f94" />

  <img width="954" height="296" alt="image" src="https://github.com/user-attachments/assets/d750cd14-b6bb-4d40-af4a-a1c383665551" />

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the official Singapore NRIC/FIN validation algorithm
- Built with PowerApps Component Framework (PCF)
- Developed for use in Microsoft Power Apps model-driven applications
- Wikipedia page: https://en.wikipedia.org/wiki/National_Registration_Identity_Card

## Support

For issues, questions, or contributions, please use the GitHub issue tracker.

---

**Note**: This control validates the format and checksum of NRIC/FIN numbers but does not verify if the number is actually issued by the Singapore government. Always verify identity documents through official channels. Once the managed solution is imported to the target Power Platform Environment, you may loose the capability to delete the control, so please use at caution.
