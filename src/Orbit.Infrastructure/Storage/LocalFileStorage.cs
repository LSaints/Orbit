namespace Orbit.Infrastructure.Storage;

public class LocalFileStorage : IFileStorageService
{
    private readonly string _basePath;

    public LocalFileStorage(string basePath)
    {
        _basePath = basePath;
        Directory.CreateDirectory(_basePath);
    }

    public Task<string> UploadAsync(string bucketName, string objectName, Stream data, string contentType)
    {
        var fullPath = GetFullPath(objectName);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        using var fileStream = File.Create(fullPath);
        data.CopyTo(fileStream);

        return Task.FromResult(GetObjectUrl(objectName));
    }

    public Task RemoveAsync(string bucketName, string objectName)
    {
        var fullPath = GetFullPath(objectName);
        if (File.Exists(fullPath))
            File.Delete(fullPath);

        return Task.CompletedTask;
    }

    public string GetObjectUrl(string objectName)
    {
        return $"/uploads/{objectName}";
    }

    public string GetFullPath(string relativePath)
    {
        return Path.Combine(_basePath, relativePath);
    }

    public string GetContentType(string filePath)
    {
        var ext = Path.GetExtension(filePath).ToLowerInvariant();
        return ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            ".gif" => "image/gif",
            ".mp4" => "video/mp4",
            ".webm" => "video/webm",
            ".ogg" or ".ogv" => "video/ogg",
            ".pdf" => "application/pdf",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
    }
}
