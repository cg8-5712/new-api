package common

import (
	"embed"
	"io/fs"
	"net/http"
	"os"

	"github.com/gin-contrib/static"
)

// Credit: https://github.com/gin-contrib/static/issues/19

type embedFileSystem struct {
	http.FileSystem
}

func (e *embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	if err != nil {
		return false
	}
	return true
}

func (e *embedFileSystem) Open(name string) (http.File, error) {
	if name == "/" {
		// This will make sure the index page goes to NoRouter handler,
		// which will use the replaced index bytes with analytic codes.
		return nil, os.ErrNotExist
	}
	return e.FileSystem.Open(name)
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	efs, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return &embedFileSystem{
		FileSystem: http.FS(efs),
	}
}

// themeAwareFileSystem currently serves the default frontend only.
// Keep the wrapper so the call site and future expansion stay simple.
type themeAwareFileSystem struct {
	defaultFS static.ServeFileSystem
}

func (t *themeAwareFileSystem) Exists(prefix string, path string) bool {
	return t.defaultFS.Exists(prefix, path)
}

func (t *themeAwareFileSystem) Open(name string) (http.File, error) {
	return t.defaultFS.Open(name)
}

func NewThemeAwareFS(defaultFS static.ServeFileSystem) static.ServeFileSystem {
	return &themeAwareFileSystem{defaultFS: defaultFS}
}
