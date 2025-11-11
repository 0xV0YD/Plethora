# x402 Wizard - Killer Terminal UI

A visually stunning Go CLI tool for configuring x402 load simulations with neon colors, animations, and glowing effects.

## 🎨 Features

- **Neon Color Scheme**: Cyberpunk-inspired cyan, magenta, green, and yellow colors
- **Animated Progress**: Smooth progress bars with color transitions
- **Glowing Effects**: Enhanced visual feedback with glow colors
- **Spinners**: Modern loading animations for async operations
- **Interactive Prompts**: Enhanced selection and input with fuzzy search
- **Visual Indicators**: Animated bars for scale, duration, and ramp-up
- **Summary Tables**: Beautiful bordered configuration summaries
- **Success Animations**: Sparkle effects and checkmarks

## 📦 Installation

```bash
# Clone or copy the go-cli directory
cd go-cli

# Install dependencies
go mod download

# Build the executable
go build -o x402-wizard
```

## 🚀 Usage

```bash
# Run the wizard
./x402-wizard

# The wizard will guide you through 9 interactive steps with stunning visuals
```

## 🎯 What's New

### Visual Enhancements
- **Neon borders** with glowing box-drawing characters
- **Animated progress bars** that fill gradually with color transitions
- **Loading spinners** for async operations
- **Success checkmarks** with green glow
- **Pulsing error** messages
- **Sparkle animations** for deployment success
- **Gradient text** support
- **Enhanced prompts** with better visual feedback

### Technical Features
- Organized code structure with separate packages
- Enhanced error handling
- Modern Go modules setup
- Clean separation of concerns (ui, config, client)

## 📁 Project Structure

```
go-cli/
├── main.go              # Main entry point with enhanced flow
├── go.mod               # Go module dependencies
├── config/
│   └── config.go        # Configuration struct and YAML handling
├── client/
│   └── client.go        # Backend API client
└── ui/
    ├── styles.go        # Neon colors and banner
    ├── prompts.go       # Enhanced interactive prompts
    └── visualizations.go # Animated progress and charts
```

## 🎨 Color Palette

- **Neon Cyan**: Primary highlights and borders
- **Neon Magenta**: Section headers and dividers
- **Neon Green**: Success states and confirmations
- **Neon Yellow**: Warnings and info
- **Neon Red**: Errors and heavy load indicators
- **Dim White**: Helper text and descriptions

## 📦 Dependencies

```go
github.com/briandowns/spinner  // Animated loading spinners
github.com/fatih/color         // Terminal colors
github.com/manifoldco/promptui // Enhanced prompts
gopkg.in/yaml.v3              // YAML config handling
```

## 🔧 Customization

### Change Colors
Edit `ui/styles.go` to customize the neon color palette.

### Modify Animations
Adjust timing and effects in `ui/visualizations.go`.

### Update Banner
Change the ASCII art in `ui/styles.go` `PrintEnhancedBanner()`.

## 💡 Tips

- The CLI uses ANSI escape codes - works best in modern terminals
- For best experience, use a terminal with true color support
- Recommended terminals: iTerm2, Alacritty, Windows Terminal

## 🚀 Next Steps

After running the wizard:

1. **Monitor simulation**: `./x402-wizard status <simulation-id>`
2. **View config**: `cat config.yaml`
3. **Analyze results**: Check the dashboard URL from deployment

## 📝 License

MIT License - Feel free to use and modify!

---

**Made with ⚡ by the x402 team**
